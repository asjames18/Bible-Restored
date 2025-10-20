#!/usr/bin/env python3
"""
Modernize archaic English in the restored KJV Bible
"""

import json
import io
import sys
import os

# Fix Windows console encoding issues
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def load_json(path: str) -> dict:
    with io.open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: dict) -> None:
    with io.open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def modernize_text(text: str, replacements: dict) -> str:
    """Apply all modernization replacements to text"""
    result = text
    
    # First pass: standard replacements with spaces
    for old, new in replacements.items():
        result = result.replace(old, new)
    
    # Second pass: handle capitalized versions at start of sentences
    capitalized_replacements = {
        " Thee ": " You ",
        " Thou ": " You ",
        " Thy ": " Your ",
        " Thine ": " Your ",
        " Ye ": " You ",
        " Art ": " Are ",
        " Hast ": " Have ",
        " Hadst ": " Had ",
        " Doest ": " Do ",
        " Didst ": " Did ",
        " Wilt ": " Will ",
        " Shalt ": " Shall ",
        " Shouldst ": " Should ",
        " Wouldst ": " Would ",
        " Mayest ": " May ",
        " Mightest ": " Might ",
        " Canst ": " Can ",
        " Couldst ": " Could ",
        " Knowest ": " Know ",
        " Sayest ": " Say ",
        " Saith ": " Says ",
        " Doth ": " Does ",
        " Hath ": " Has ",
        " Spake ": " Spoke ",
        " Shew ": " Show ",
        " Shewed ": " Showed ",
        " Betwixt ": " Between ",
        " Whence ": " From where ",
        " Whither ": " To where ",
        " Wherefore ": " Why ",
        " Hither ": " Here ",
        " Thither ": " There ",
        " Forsooth ": " Indeed ",
        " Peradventure ": " Perhaps ",
        " Verily ": " Truly ",
        " Lest ": " In case ",
        " Yea ": " Yes ",
        " Nay ": " No ",
        " Anon ": " Soon ",
        " Aught ": " Anything ",
        " Nought ": " Nothing ",
        " Behold ": " Look ",
        " Lo ": " Look ",
        " Woe ": " Sorrow ",
        " Marvel ": " Be amazed ",
        " Charity ": " Love ",
        " Concupiscence ": " Lust ",
        " Fornication ": " Sexual immorality ",
        " Unto ": " To ",
    }
    
    for old, new in capitalized_replacements.items():
        result = result.replace(old, new)
    
    # Third pass: handle words inside curly braces or at boundaries
    boundary_replacements = [
        ("{art}", "{are}"),
        ("{Art}", "{Are}"),
        ("thee,", "you,"),
        ("thee.", "you."),
        ("thee:", "you:"),
        ("thee;", "you;"),
        ("thee?", "you?"),
        ("thee!", "you!"),
        ("thou,", "you,"),
        ("thou.", "you."),
        ("thou:", "you:"),
        ("thou;", "you;"),
        ("thou?", "you?"),
        ("thou!", "you!"),
        ("thy ", "your "),
        ("thine ", "your "),
        (",thee ", ",you "),
        (",thou ", ",you "),
    ]
    
    for old, new in boundary_replacements:
        result = result.replace(old, new)
    
    return result


def modernize_bible(bible_json: dict, replacements: dict) -> dict:
    """Apply modernization to all verses in the Bible"""
    modernized = {}
    total_replacements = 0
    
    for book, chapters in bible_json.items():
        modernized[book] = {}
        for chapter, verses in chapters.items():
            modernized[book][chapter] = {}
            for verse, text in verses.items():
                original_text = text
                modernized_text = modernize_text(text, replacements)
                modernized[book][chapter][verse] = modernized_text
                
                if original_text != modernized_text:
                    total_replacements += 1
    
    print(f"Modernized {total_replacements} verses")
    return modernized


def main():
    # Define all the replacements
    replacements = {
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
    
    # File paths
    source_file = "build/restored_kjv.json"
    target_files = [
        "build/restored_kjv.json",
        "../frontend/public/translations/restored_kjv.json",
        "../frontend/dist/translations/restored_kjv.json"
    ]
    
    print(f"Loading {source_file}...")
    bible_json = load_json(source_file)
    
    print("Applying modernization replacements...")
    modernized_bible = modernize_bible(bible_json, replacements)
    
    print("\nSaving modernized Bible to:")
    for target_file in target_files:
        if os.path.exists(os.path.dirname(target_file)):
            save_json(target_file, modernized_bible)
            print(f"  ✓ {target_file}")
        else:
            print(f"  ✗ {target_file} (directory doesn't exist)")
    
    print("\nModernization complete!")


if __name__ == "__main__":
    main()

