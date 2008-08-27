class CreateQuizzes < ActiveRecord::Migration
  def self.up
    create_table :quizzes do |t|
      t.string :title
      t.integer :num_choices
      t.integer :num_questions

      t.timestamps
    end
  end

  def self.down
    drop_table :quizzes
  end
end
