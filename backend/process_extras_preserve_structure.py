#!/usr/bin/env python3
"""
Normalize extras (e.g., Book of Enoch) with structure preservation.
Applies sacred names and modernization while keeping empty chapters intact.
"""

import io
import json
import os
import sys
import re


def load_json(path: str) -> dict:
    with io.open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: dict) -> None:
    with io.open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def compile_sacred_name_rules(cfg: dict) -> list:
    """Compile regex rules from config."""
    rules = []
    for rule in cfg.get("rules", []):
        pattern = rule.get("pattern", "")
        replacement = rule.get("replacement", "")
        case_insensitive = rule.get("case_insensitive", False)
        flags = re.IGNORECASE if case_insensitive else 0
        rules.append((re.compile(pattern, flags), replacement, rule.get("description", "")))
    return rules


def apply_sacred_names(text: str, rules: list, overrides: dict) -> str:
    """Apply sacred name replacements."""
    # Apply regex rules
    for pattern, replacement, _desc in rules:
        text = pattern.sub(replacement, text)
    
    # Apply overrides (exact matches)
    for old, new in overrides.items():
        text = text.replace(old, new)
    
    return text


def get_modern_replacements() -> dict:
    """Get modernization replacement map."""
    return {
        " thee ": " you ",
        " thou ": " you ",
        " thy ": " your ",
        " thine ": " your ",
        " ye ": " you ",
        " art ": " are ",
        " hast ": " have ",
        " hadst ": " had ",
        " doest ": " do ",
        " didst ": " did ",
        " wilt ": " will ",
        " shalt ": " shall ",
        " shouldst ": " should ",
        " wouldst ": " would ",
        " mayest ": " may ",
        " mightest ": " might ",
        " canst ": " can ",
        " couldst ": " could ",
        " knowest ": " know ",
        " sayest ": " say ",
        " saith ": " says ",
        " doth ": " does ",
        " hath ": " has ",
        " spake ": " spoke ",
        " shew ": " show ",
        " shewed ": " showed ",
        " betwixt ": " between ",
        " whence ": " from where ",
        " whither ": " to where ",
        " wherefore ": " why ",
        " hither ": " here ",
        " thither ": " there ",
        " forsooth ": " indeed ",
        " peradventure ": " perhaps ",
        " verily ": " truly ",
        " lest ": " in case ",
        " yea ": " yes ",
        " nay ": " no ",
        " anon ": " soon ",
        " aught ": " anything ",
        " nought ": " nothing ",
        " behold ": " look ",
        " lo ": " look ",
        " woe ": " sorrow ",
        " marvel ": " be amazed ",
        " charity ": " love ",
        " concupiscence ": " lust ",
        " fornication ": " sexual immorality ",
        " unto ": " to ",
        # Capitalized versions
        " Thee ": " You ",
        " Thou ": " You ",
        " Thy ": " Your ",
        " Thine ": " Your ",
        " Ye ": " You ",
        " Behold ": " Look ",
        " Lo ": " Look ",
        " Wherefore ": " Why ",
        " Verily ": " Truly ",
        # Boundary cases
        "thee,": "you,",
        "thee.": "you.",
        "thee:": "you:",
        "thee;": "you;",
        "thee?": "you?",
        "thee!": "you!",
        "thou,": "you,",
        "thou.": "you.",
        "thou:": "you:",
        "thou;": "you;",
        "thou?": "you?",
        "thou!": "you!",
    }


def modernize_text(text: str, replacements: dict) -> str:
    """Apply modernization replacements to text."""
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def process_extras_with_structure(extras: dict, sacred_rules: list, overrides: dict, modern_replacements: dict) -> dict:
    """Process all verses while preserving chapter structure (including empty chapters)."""
    processed = {}
    verse_count = 0
    
    for book_name, chapters in extras.items():
        processed[book_name] = {}
        for chapter_num, verses in chapters.items():
            processed[book_name][chapter_num] = {}
            for verse_num, verse_text in verses.items():
                # Apply sacred names
                text = apply_sacred_names(verse_text, sacred_rules, overrides)
                # Apply modernization
                text = modernize_text(text, modern_replacements)
                processed[book_name][chapter_num][verse_num] = text
                verse_count += 1
    
    print(f"Processed {verse_count} verses across {sum(len(ch) for ch in extras.values())} chapters")
    return processed


def main() -> int:
    if len(sys.argv) < 2:
        extras_path = os.path.join("frontend", "public", "translations", "restored_kjv.extras.json")
    else:
        extras_path = sys.argv[1]
    
    if not os.path.exists(extras_path):
        print(f"Extras JSON not found: {extras_path}")
        return 2
    
    print(f"Loading extras: {extras_path}")
    extras = load_json(extras_path)
    
    # Load sacred names config
    cfg_path = os.path.join("backend", "config", "restored_names_config.json")
    if not os.path.exists(cfg_path):
        cfg_path = os.path.join("config", "restored_names_config.json")
    
    overrides_path = os.path.join("backend", "config", "restored_overrides.json")
    if not os.path.exists(overrides_path):
        overrides_path = os.path.join("config", "restored_overrides.json")
    
    print("Loading sacred names configuration...")
    cfg = load_json(cfg_path)
    overrides_json = load_json(overrides_path)
    
    # Build overrides map
    overrides_map = {}
    for book_overrides in overrides_json.get("overrides", []):
        for old, new in book_overrides.get("replacements", {}).items():
            overrides_map[old] = new
    
    sacred_rules = compile_sacred_name_rules(cfg)
    modern_replacements = get_modern_replacements()
    
    print("Applying sacred names and modernization...")
    processed = process_extras_with_structure(extras, sacred_rules, overrides_map, modern_replacements)
    
    save_json(extras_path, processed)
    print(f"Saved normalized extras: {extras_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

