class ThingTypeOfThing < ActiveRecord::Base
  belongs_to :thing
  belongs_to :type_of_thing

  validates :thing, :type_of_thing, presence: true

  scope :with_thing_name,    ->{ joins(:thing).select("thing_type_of_things.*, things.name as thing_name")}
  scope :with_tag_name,      ->{ joins(:type_of_thing ).select("thing_type_of_things.*, type_of_things.name as tag_name")}

end
