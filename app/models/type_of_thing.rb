class TypeOfThing < ActiveRecord::Base
  validates :name, presence: true
  has_many :thing_type_of_things,inverse_of: :type_of_thing, dependent: :destroy
  has_many :things, through: :thing_type_of_things
end
