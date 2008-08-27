class RemoveNumChoicesFromQuiz < ActiveRecord::Migration
  def self.up
    remove_column :quizzes, :num_choices
  end

  def self.down
    add_column :quizzes, :num_choices, :integer
  end
end
