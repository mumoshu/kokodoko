class AddUserIdToQuiz < ActiveRecord::Migration
  def self.up
    add_column :quizzes, :user_id, :integer
  end

  def self.down
    remove_column :quizzes, :user_id
  end
end
