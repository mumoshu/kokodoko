class AddMagnifyScaleAndNormalScaleAndDemagnifyScaleToMark < ActiveRecord::Migration
  def self.up
    add_column :marks, :magnify_scale, :integer
    add_column :marks, :normal_scale, :integer
    add_column :marks, :demagnify_scale, :integer
  end

  def self.down
    remove_column :marks, :demagnify_scale
    remove_column :marks, :normal_scale
    remove_column :marks, :magnify_scale
  end
end
