module.exports = (sequelize, type) => {
  return sequelize.define(
    "surveys",
    {
      row_survey: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      row_mawoi: type.INTEGER,
      sv_measure_timestamp: type.DATE,
      sv_init_date: type.DATE,
      sv_end_date: type.DATE,
      sv_is_reference: type.BOOLEAN,
      sv_alarm_level: type.INTEGER,
      create_user: type.STRING,
      create_user: type.STRING,
      state: {
        allowNull: false,
        type: type.BOOLEAN,
      },
      update_date: type.DATE,
      update_user: type.DATE,
      create_date: type.DATE,
    },
    {
      timestamps: false,
      tableName: "surveys",
    }
  );
};
