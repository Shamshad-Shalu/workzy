export const HOME_SECTION = {
  EXISTS: "Home section name already exists.",
  CREATED: "Home section created successfully.",
  UPDATED: "Home section updated successfully.",
  DELETED: "Home section deleted successfully.",
  NOT_FOUND: "Home section not found.",

  ENABLED: "Section enabled successfully.",
  DISABLED: "Section disabled successfully.",
  IN_LAYOUT_CANNOT_DELETE:
    "Cannot delete section while it is in the home layout. Remove it from layout first.",
  IN_LAYOUT_CANNOT_DISABLE:
    "Cannot disable section while it is in the home layout. Remove it from layout first.",
  IN_LAYOUT_CANNOT_CHANGE_TYPE: "Cannot change section type while it is in the home layout",
};

export const HOME_LAYOUT = {
  DUPLICATE_SECTIONS: "Duplicate section IDs found in layout",
  SECTIONS_NOT_EXIST: "Some sections do not exist",
  SECTION_DISABLED: (name: string) => `Section "${name}" is disabled and cannot be added to layout`,
  ONLY_ONE_ALLOWED: (type: string) => `Only one ${type} section is allowed in the layout`,
  SAVED: "Layout saved successfully",
};
