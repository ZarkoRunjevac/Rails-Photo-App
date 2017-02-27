#json.array! @types_of_thing, :id, :name

json.array! @type_of_things, partial: 'type_of_things/type_of_thing', as: :type_of_thing