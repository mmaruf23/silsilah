-- Migration number: 0003 	 2026-02-01T17:15:24.452Z
INSERT INTO
    mariage (
        husband_id,
        wife_id,
        created_at
    )
VALUES (
        1,
        2,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );