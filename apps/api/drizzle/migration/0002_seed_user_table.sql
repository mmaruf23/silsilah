-- Migration number: 0002 	 2026-02-01T17:15:17.806Z
INSERT INTO
    users (
        username,
        password,
        role,
        created_at
    )
VALUES (
        'iniadmin',
        NULL,
        'admin',
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        'rifasella',
        NULL,
        'admin',
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );