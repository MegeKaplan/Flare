import db from "../config/db/db_conn.js";
import MESSAGES from "../constants/messages.js";

export const getRoles = async (req, res) => {
  const query = req.query;

  try {
    const roles = await db("roles")
      .select("*")
      .where({ is_deleted: false, ...query });

    res.status(200).json({
      message: MESSAGES.ROLES_FETCH_SUCCESS,
      response: roles,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const getRole = async (req, res) => {
  const query = req.query;
  const roleId = req.params.id;

  try {
    const role = await db("roles")
      .select("*")
      .where({ is_deleted: false, id: roleId, ...query })
      .first();

    res.status(200).json({
      message: MESSAGES.FETCH_SUCCESS,
      response: role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const { user_id, name, description, slug, color } = req.body;

    const user = await db("users").where({ id: user_id }).first();
    if (!user)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const permissions = await db("role_permissions")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where("role_permissions.role_id", user.role_id)
      .select("permissions.slug");

    const hasPermission = permissions.some(
      (perm) => perm.slug === "create_role"
    );
    if (!hasPermission)
      return res.status(403).json({ message: MESSAGES.PERMISSION_DENIED });

    const existingRole =
      (await db("roles").where({ name }).first()) ||
      (await db("roles").where({ slug }).first());
    if (existingRole) {
      return res.status(400).json({ message: MESSAGES.ROLE_ALREADY_EXISTS });
    }

    const [roleId] = await db("roles").insert({
      name,
      description,
      slug,
      color,
      created_by: user_id,
    });

    return res
      .status(201)
      .json({ message: MESSAGES.ROLE_CREATE_SUCCESS, response: roleId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const query = req.query;
    const roleId = req.params.id;
    const { user_id, name, description, slug, color } = req.body;

    const user = await db("users").where({ id: user_id }).first();
    if (!user)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const permissions = await db("role_permissions")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where("role_permissions.role_id", user.role_id)
      .select("permissions.slug");

    const hasPermission = permissions.some(
      (perm) => perm.slug === "update_role"
    );
    if (!hasPermission)
      return res.status(403).json({ message: MESSAGES.PERMISSION_DENIED });

    const role = await db("roles")
      .where({ id: roleId, ...query })
      .first();
    if (!role) {
      return res.status(404).json({ message: MESSAGES.ROLE_NOT_FOUND });
    }

    await db("roles")
      .where({ id: roleId })
      .update({ name, description, slug, color });

    return res
      .status(200)
      .json({ message: MESSAGES.ROLE_UPDATE_SUCCESS, response: roleId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const query = req.query;
    const roleId = req.params.id;
    const { user_id } = req.body;

    const user = await db("users").where({ id: user_id }).first();
    if (!user)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const permissions = await db("role_permissions")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where("role_permissions.role_id", user.role_id)
      .select("permissions.slug");

    const hasPermission = permissions.some(
      (perm) => perm.slug === "delete_role"
    );
    if (!hasPermission)
      return res.status(403).json({ message: MESSAGES.PERMISSION_DENIED });

    const role = await db("roles")
      .where({ id: roleId, ...query })
      .first();
    if (!role) {
      return res.status(404).json({ message: MESSAGES.ROLE_NOT_FOUND });
    }

    await db("roles").where({ id: roleId }).update({ is_deleted: true });

    return res
      .status(200)
      .json({ message: MESSAGES.ROLE_DELETE_SUCCESS, response: roleId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const assignRole = async (req, res) => {
  try {
    const query = req.query;
    const roleId = req.params.id;
    const { user_id, target_user_id } = req.body;

    const assignedBy = await db("users").where({ id: user_id }).first();
    if (!assignedBy)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const targetUser = await db("users").where({ id: target_user_id }).first();
    if (!targetUser)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const permissions = await db("role_permissions")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where("role_permissions.role_id", assignedBy.role_id)
      .select("permissions.slug");

    const hasPermission = permissions.some(
      (perm) => perm.slug === "assign_role"
    );
    if (!hasPermission)
      return res.status(403).json({ message: MESSAGES.PERMISSION_DENIED });

    const role = await db("roles")
      .where({ id: roleId, ...query })
      .first();
    if (!role) {
      return res.status(404).json({ message: MESSAGES.ROLE_NOT_FOUND });
    }

    await db("users").where({ id: target_user_id }).update({ role_id: roleId });

    return res
      .status(200)
      .json({ message: MESSAGES.ROLE_ASSIGN_SUCCESS, response: roleId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const revokeRole = async (req, res) => {
  try {
    const query = req.query;
    const roleId = req.params.id;
    const { user_id, target_user_id } = req.body;

    const revokedBy = await db("users").where({ id: user_id }).first();
    if (!revokedBy)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const targetUser = await db("users").where({ id: target_user_id }).first();
    if (!targetUser)
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });

    const permissions = await db("role_permissions")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where("role_permissions.role_id", revokedBy.role_id)
      .select("permissions.slug");

    const hasPermission = permissions.some(
      (perm) => perm.slug === "revoke_role"
    );
    if (!hasPermission)
      return res.status(403).json({ message: MESSAGES.PERMISSION_DENIED });

    const role = await db("roles")
      .where({ id: roleId, ...query })
      .first();
    if (!role) {
      return res.status(404).json({ message: MESSAGES.ROLE_NOT_FOUND });
    }

    await db("users")
      .where({ id: target_user_id })
      .update({ role_id: db.raw("DEFAULT") });

    return res
      .status(200)
      .json({ message: MESSAGES.ROLE_REVOKE_SUCCESS, response: roleId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};
