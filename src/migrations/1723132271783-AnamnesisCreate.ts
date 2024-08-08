import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class AnamnesisCreate1723132271783 implements MigrationInterface {
  name: "AnamnesisCreate1723132271783";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "anamnesis_form",
        columns: [
          {
            name: "id",
            type: "character varying",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "title",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: "anamnesis_section",
        columns: [
          {
            name: "id",
            type: "character varying",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "form_id",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "title",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "order",
            type: "int",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "anamnesis_section",
      new TableForeignKey({
        columnNames: ["form_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "anamnesis_form",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.query(`
        CREATE TYPE "question_type_enum" AS ENUM (
            'short_answer',
            'long_answer',
            'date',
            'date_time',
            'time',
            'multiple_choice',
            'select'
        )
    `);

    await queryRunner.createTable(
      new Table({
        name: "anamnesis_question",
        columns: [
          {
            name: "id",
            type: "character varying",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "section_id",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "question_text",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "question_type",
            type: "question_type_enum",
            isNullable: false,
          },
          {
            name: "options",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "anamnesis_question",
      new TableForeignKey({
        columnNames: ["section_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "anamnesis_section",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "anamnesis_response",
        columns: [
          {
            name: "id",
            type: "character varying",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "customer_id",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "order_id",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "form_id",
            type: "character varying",
            isNullable: false,
          },
          {
            name: "responses",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "anamnesis_response",
      new TableForeignKey({
        columnNames: ["form_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "anamnesis_form",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let table = await queryRunner.getTable("anamnesis_question");
    let foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("section_id") !== -1
    );
    await queryRunner.dropForeignKey("anamnesis_question", foreignKey);
    await queryRunner.dropTable("anamnesis_question");
    await queryRunner.query(`DROP TYPE "question_type_enum"`);

    table = await queryRunner.getTable("anamnesis_section");
    foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("form_id") !== -1
    );
    await queryRunner.dropForeignKey("anamnesis_section", foreignKey);
    await queryRunner.dropTable("anamnesis_section");

    table = await queryRunner.getTable("anamnesis_response");
    foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("form_id") !== -1
    );
    await queryRunner.dropForeignKey("anamnesis_response", foreignKey);
    await queryRunner.dropTable("anamnesis_response");

    await queryRunner.dropTable("anamnesis_form");
  }
}
