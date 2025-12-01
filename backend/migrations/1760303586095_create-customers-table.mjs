export function up(pgm) {
  pgm.createExtension('pgcrypto', { ifNotExists: true });

  pgm.createTable('customers', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    address: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', unique: true, notNull: true },
    phone: { type: 'varchar(50)', notNull: true },
    city: { type: 'varchar(100)', notNull: true },
    state: { type: 'varchar(50)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
}

export function down(pgm) {
  pgm.dropTable('customers');
}
