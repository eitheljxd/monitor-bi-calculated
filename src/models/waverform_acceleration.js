module.exports = (sequelize, type) => {
  return sequelize.define(
    "waveforms_acceleration",
    {
      row_waveform_acceleration: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      row_point: type.INTEGER,
      row_survey: type.INTEGER,
      wfa_timestamp: type.STRING,
      wfa_measure_x: type.DECIMAL,
      wfa_measure_Y: type.DECIMAL,
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
      tableName: "waveforms_acceleration",
    }
  );
};
