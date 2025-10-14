#!/usr/bin/env python3
"""
KJV → Restored-Names converter with JSON I/O support
"""

import argparse
import csv
import io
import json
import logging
import os
import re
import sys
from typing import Dict, Iterable, List, Sequence, Tuple, Union


Rule = Tuple[re.Pattern, str, str]


def setup_logging(verbosity: int) -> None:
    level = logging.WARNING
    if verbosity == 1:
        level = logging.INFO
    elif verbosity >= 2:
        level = logging.DEBUG
    logging.basicConfig(
        level=level,
        format="%(levelname)s %(message)s",
    )


def load_json(path: str) -> dict:
    with io.open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def decode_pattern(pattern: str) -> str:
    return pattern


def compile_rules(cfg: dict) -> List[Rule]:
    compiled: List[Rule] = []
    for rule in cfg.get("rules", []):
        fixed = decode_pattern(rule["pattern"])
        pat = re.compile(fixed)
        compiled.append((pat, rule["replacement"], rule.get("description", "")))
        logging.debug("Compiled rule: %s -> %s", fixed, rule["replacement"])
    return compiled


def apply_rules(text: str, rules: Sequence[Rule]) -> Tuple[str, List[Tuple[str, int]]]:
    report: List[Tuple[str, int]] = []
    for pat, repl, desc in rules:
        matches = pat.findall(text)
        count = len(matches)
        if count:
            logging.debug("Rule hit: %s :: %d", desc or pat.pattern, count)
        text = pat.sub(repl, text)
        report.append((desc or pat.pattern, count))
    return text, report


def parse_verse_id(line: str) -> str:
    m = re.match(r"^([1-3]?\s?[A-Za-z ]+)\s+(\d+):(\d+)\b", line)
    if not m:
        return ""
    book = re.sub(r"\s+", " ", m.group(1).strip())
    chap = m.group(2)
    verse = m.group(3)
    return f"{book} {chap}:{verse}"


def apply_overrides_line(line: str, overrides_map: Dict[str, List[dict]]) -> str:
    vid = parse_verse_id(line)
    if not vid:
        return line
    actions = overrides_map.get(vid, [])
    out = line
    for act in actions:
        if act.get("type") == "replace":
            pat = re.compile(decode_pattern(act["pattern"]))
            out = pat.sub(act["replacement"], out)
        elif act.get("type") == "set":
            m = re.match(r"^([1-3]?\s?[A-Za-z ]+\s+\d+:\d+\s+)(.*)$", out)
            if m:
                out = m.group(1) + act.get("text", "")
    return out


def build_overrides_map(overrides_json: dict) -> Dict[str, List[dict]]:
    overrides_map: Dict[str, List[dict]] = {}
    for entry in overrides_json.get("overrides", []):
        overrides_map.setdefault(entry["id"], []).extend(entry.get("actions", []))
    return overrides_map


def bible_json_to_lines(bible_json: dict) -> List[str]:
    lines = []
    for book, chapters in bible_json.items():
        for chapter, verses in chapters.items():
            for verse, text in verses.items():
                lines.append(f"{book} {chapter}:{verse} {text}")
    return lines


def lines_to_bible_json(lines: List[str]) -> dict:
    bible = {}
    for line in lines:
        m = re.match(r"^([1-3]?\s?[A-Za-z ]+)\s+(\d+):(\d+)\s+(.*)$", line)
        if m:
            book = re.sub(r"\s+", " ", m.group(1).strip())
            chapter = m.group(2)
            verse = m.group(3)
            text = m.group(4)
            
            if book not in bible:
                bible[book] = {}
            if chapter not in bible[book]:
                bible[book][chapter] = {}
            bible[book][chapter][verse] = text
    return bible


def process_bible_json(bible_json: dict, cfg_json: dict, overrides_json: dict) -> Tuple[dict, List[Tuple[str, int]]]:
    lines = bible_json_to_lines(bible_json)
    rules = compile_rules(cfg_json)
    overrides_map = build_overrides_map(overrides_json)
    
    processed_lines = []
    all_reports = []
    
    for line in lines:
        processed_line, report = apply_rules(line, rules)
        all_reports.extend(report)
        processed_line = apply_overrides_line(processed_line, overrides_map)
        processed_lines.append(processed_line)
    
    restored_bible = lines_to_bible_json(processed_lines)
    
    report_dict = {}
    for desc, count in all_reports:
        report_dict[desc] = report_dict.get(desc, 0) + count
    
    final_report = list(report_dict.items())
    return restored_bible, final_report


def write_report_csv(report_path: str, report_rows: Iterable[Tuple[str, int]]) -> None:
    with io.open(report_path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Rule Description", "Matches/Replacements"])
        for desc, count in report_rows:
            w.writerow([desc, count])


def main(argv: Sequence[str] = None) -> int:
    parser = argparse.ArgumentParser(description="KJV → Restored-Names converter")
    parser.add_argument("--json", type=str, help="Path to KJV JSON file")
    parser.add_argument("--src", type=str, help="Path to KJV source text file")
    parser.add_argument("--config", type=str, default="config/restored_names_config.json", help="Path to global rules JSON")
    parser.add_argument("--overrides", type=str, default="config/restored_overrides.json", help="Path to verse-level overrides JSON")
    parser.add_argument("--out_txt", type=str, default="build/restored_kjv.txt", help="Path to write restored text")
    parser.add_argument("--out_json", type=str, default="build/restored_kjv.json", help="Path to write restored JSON")
    parser.add_argument("--report", type=str, default="build/replacements_report.csv", help="Path to write replacements report CSV")
    parser.add_argument("-v", "--verbose", action="count", default=0, help="Increase verbosity (-v, -vv)")

    args = parser.parse_args(argv)
    setup_logging(args.verbose)

    if not args.json and not args.src:
        logging.error("Must provide either --json or --src")
        return 2

    try:
        cfg_json = load_json(args.config)
        overrides_json = load_json(args.overrides)
    except FileNotFoundError as e:
        logging.error("Config file not found: %s", e)
        return 2
    except json.JSONDecodeError as e:
        logging.error("Invalid JSON in config/overrides: %s", e)
        return 2

    os.makedirs(os.path.dirname(args.out_txt), exist_ok=True)
    os.makedirs(os.path.dirname(args.out_json), exist_ok=True)
    os.makedirs(os.path.dirname(args.report), exist_ok=True)

    if args.json:
        if not os.path.exists(args.json):
            logging.error("JSON file not found: %s", args.json)
            return 2
        
        logging.info("Reading JSON Bible: %s", args.json)
        bible_json = load_json(args.json)
        restored_bible, report = process_bible_json(bible_json, cfg_json, overrides_json)
        
        with io.open(args.out_json, "w", encoding="utf-8") as f:
            json.dump(restored_bible, f, indent=2, ensure_ascii=False)
        
        lines = bible_json_to_lines(restored_bible)
        with io.open(args.out_txt, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    write_report_csv(args.report, report)

    logging.info("Wrote restored text: %s", args.out_txt)
    if args.json:
        logging.info("Wrote restored JSON: %s", args.out_json)
    logging.info("Wrote report: %s", args.report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
