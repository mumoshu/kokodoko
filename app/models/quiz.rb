class Quiz < ActiveRecord::Base
  has_many :marks
  has_many :scores
  belongs_to :user
end
