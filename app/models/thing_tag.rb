class ThingTag < ActiveRecord::Base
  belongs_to :thing
  belongs_to :tag

  validates :thing, :tag, presence: true

  scope :with_thing_name,    ->{ joins(:thing).select("thing_tags.*, things.name as thing_name")}
  scope :with_tag_name,      ->{ joins(:tag ).select("thing_tags.*, tags.name as tag_name")}

end
