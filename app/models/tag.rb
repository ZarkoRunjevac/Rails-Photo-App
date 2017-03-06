class Tag < ActiveRecord::Base
  include Protectable
  validates :name, presence: true
  has_many :thing_tags,inverse_of: :tag, dependent: :destroy
  has_many :things, through: :thing_tags

  scope :not_linked, ->(thing) { where.not("t.id"=>ThingTag.select(:tag_id)
                                                    .where(:thing=>thing)) }

end
