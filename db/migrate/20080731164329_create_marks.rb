class CreateMarks < ActiveRecord::Migration
  def self.up
    create_table :marks do |t|
      t.string :lat
      t.string :lng
      t.string :title

      t.timestamps
    end
  end

  def self.down
    drop_table :marks
  end
end
