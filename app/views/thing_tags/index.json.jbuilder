json.array!(@tags) do |tag|
  json.extract! tag, :id, :thing_id, :tag_id, :creator_id, :created_at, :updated_at
  json.thing_name tag.thing_name        if tag.respond_to?(:thing_name)
  json.tag_name tag.tag_name            if tag.respond_to?(:tag_name)
end