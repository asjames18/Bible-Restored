#!/usr/bin/env python3
"""
Normalize extras (e.g., Book of Enoch) to match app style:
 - Apply sacred names restoration (same rules as Bible)
 - Modernize archaic terms (KJV→modern tone)

Input/Output defaults to frontend/public/translations/restored_kjv.extras.json
"""

import io
import json
import os
import sys
from typing import Tuple

# Local imports from sibling scripts
from restore_names import load_json as rn_load_json, process_bible_json
from modernize_language import modernize_bible


def save_json(path: str, data: dict) -> None:
    with io.open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def load_json(path: str) -> dict:
    with io.open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_modern_replacements() -> dict:
    # Mirror replacements in modernize_language.py (subset sufficient for extras)
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
    }


def main() -> int:
    extras_path = os.environ.get(
        "EXTRAS_JSON",
        os.path.join("frontend", "public", "translations", "restored_kjv.extras.json"),
    )

    if not os.path.exists(extras_path):
        print(f"Extras JSON not found: {extras_path}")
        return 2

    print(f"Loading extras: {extras_path}")
    extras = load_json(extras_path)

    # Sacred names pass
    cfg = rn_load_json(os.path.join("backend", "config", "restored_names_config.json")) if os.path.exists(os.path.join("backend", "config", "restored_names_config.json")) else rn_load_json(os.path.join("config", "restored_names_config.json"))
    overrides = rn_load_json(os.path.join("backend", "config", "restored_overrides.json")) if os.path.exists(os.path.join("backend", "config", "restored_overrides.json")) else rn_load_json(os.path.join("config", "restored_overrides.json"))
    restored, _report = process_bible_json(extras, cfg, overrides)

    # Modernization pass
    replacements = get_modern_replacements()
    modern = modernize_bible(restored, replacements)

    # Save back
    save_json(extras_path, modern)
    print(f"Saved normalized extras with sacred names and modern terms: {extras_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())


