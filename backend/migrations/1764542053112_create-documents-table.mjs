/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("documents", {
    id: "id",
    content: { type: "text", notNull: true },
    metadata: { type: "jsonb" },
    embedding: { type: "vector(1536)", notNull: true },
    created_at: {
      type: "timestamp",
      default: pgm.func("now()")
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("documents");
};
