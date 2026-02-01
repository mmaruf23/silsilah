-- Migration number: 0001 	 2026-02-01T17:15:01.641Z
INSERT INTO
    persons (
        name,
        address,
        gender,
        created_at
    )
VALUES (
        "mastaka",
        "pasirmakam",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "sapiah",
        "pasirmakam",
        "female",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "saprudin",
        "kukulu",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "safaat",
        "leweungkadu",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "mulyanah",
        "pasirmakam",
        "female",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "surmanah",
        "pasirmakam",
        "female",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "salikun",
        "pasirmakam",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );