class AddViewTypeToQuiz < ActiveRecord::Migration
  def self.up
    add_column :quizzes, :view_type, :string
  end

  def self.down
    remove_column :quizzes, :view_type
  end
end
