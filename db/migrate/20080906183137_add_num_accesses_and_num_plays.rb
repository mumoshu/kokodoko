class AddNumAccessesAndNumPlays < ActiveRecord::Migration
  def self.up
    add_column :quizzes, :num_accesses, :integer, :default => 0
    add_column :quizzes, :num_plays, :integer, :default => 0
  end

  def self.down
    remove_column :quizzes, :num_accesses
    remove_column :quizzes, :num_plays
  end
end
