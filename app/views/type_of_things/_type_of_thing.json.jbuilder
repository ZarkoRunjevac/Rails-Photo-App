json.extract! type_of_thing, :id, :name,  :created_at, :updated_at
json.url type_of_thing_url(type_of_thing, format: :json)
json.user_roles type_of_thing.user_roles     unless type_of_thing.user_roles.empty?