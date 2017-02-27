class TypeOfThing < ActiveRecord::Base
  validates :name, presence: true
  has_many :thing_type_of_things,inverse_of: :type_of_thing, dependent: :destroy
  has_many :things, through: :thing_type_of_things

  scope :not_linked, ->(thing) { where.not(:id=>ThingTypeOfThing.select(:type_of_thing_id)
                                                    .where(:thing=>thing)) }
end
