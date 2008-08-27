class AddMagnifyScaleAndNormalScaleAndDemagnifyScaleToQuiz < ActiveRecord::Migration
  def self.up
    add_column :quizzes, :magnify_scale, :integer
    add_column :quizzes, :normal_scale, :integer
    add_column :quizzes, :demagnify_scale, :integer
  end

  def self.down
    remove_column :quizzes, :demagnify_scale
    remove_column :quizzes, :normal_scale
    remove_column :quizzes, :magnify_scale
  end
end
