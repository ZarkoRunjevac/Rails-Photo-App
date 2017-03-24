class Image < ActiveRecord::Base
  include Protectable
  attr_accessor :image_content

  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images

  has_one :user

  scope :without_user_images, -> {joins("LEFT OUTER JOIN users on users.image_id=images.id").
                                  where("users.image_id IS null")}

  composed_of :position,
              class_name:"Point",
              allow_nil: true,
              mapping: [%w(lng lng), %w(lat lat)]

  acts_as_mappable

  def to_lat_lng
    Geokit::LatLng.new(lat,lng)
  end

  def basename
    caption || "image-#{id}"
  end
end

Point.class_eval do
  def to_lat_lng
    Geokit::LatLng.new(*latlng)
  end
end
