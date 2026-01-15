Security Note: "path": "**" allows access to any file the user selects via dialog. This is safe because:

User explicitly selects files through native OS dialogs
Dialog plugin automatically adds selected paths to scope
More restrictive than hardcoded paths for a user-facing editor

For production, consider using dialog-scoped access only (remove the fs:scope permission) since dialog automatically grants temporary access.
