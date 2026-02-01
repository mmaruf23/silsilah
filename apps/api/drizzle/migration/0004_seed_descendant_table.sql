-- Migration number: 0004 	 2026-02-01T17:15:34.066Z
INSERT INTO
    descendant (
        person_id,
        mariage_id,
        created_at
    )
VALUES (
        3,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        4,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        5,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        6,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        7,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );