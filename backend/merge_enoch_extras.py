import json
from pathlib import Path

def main():
    extras_path = Path('frontend/public/translations/restored_kjv.extras.json')
    if not extras_path.exists():
        raise SystemExit(f"Not found: {extras_path}")

    data = json.loads(extras_path.read_text(encoding='utf-8'))

    section_order = [
        'Book 1 - Watchers',
        'Book 2 - Parables',
        'Book 3 - Book of Noah',
        'Book 4 - Kingdom of Heaven',
        'Book 5 - Epistle of Enoch',
    ]

    merged: dict[str, dict[str, dict[str, str]]] = { 'Book of Enoch': {} }
    next_chapter = 1

    for section in section_order:
        if section not in data:
            continue
        chapters = data[section]
        # chapters is a dict of chapter -> verses
        # Sort chapters numerically
        for ch in sorted(chapters.keys(), key=lambda c: int(c)):
            verses = chapters[ch]
            merged['Book of Enoch'][str(next_chapter)] = verses
            next_chapter += 1

    # Pad to standard 1 Enoch mapping (108 chapters total)
    total_chapters = 108
    existing = merged['Book of Enoch']
    for n in range(1, total_chapters + 1):
        key = str(n)
        if key not in existing:
            existing[key] = {}

    # Re-sort chapter keys numerically for stable output
    merged['Book of Enoch'] = {k: existing[k] for k in sorted(existing.keys(), key=lambda x: int(x))}

    # Write back replacing the extras content with single book
    extras_path.write_text(json.dumps(merged, ensure_ascii=False), encoding='utf-8')
    print(f"Wrote merged file with {len(merged['Book of Enoch'])} chapters under 'Book of Enoch' (padded to 108)")

if __name__ == '__main__':
    main()


