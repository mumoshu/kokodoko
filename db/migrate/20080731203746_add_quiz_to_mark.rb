class AddQuizToMark < ActiveRecord::Migration
  def self.up
    add_column :marks, :quiz_id, :integer
  end

  def self.down
    remove_column :marks, :quiz_id
  end
end
