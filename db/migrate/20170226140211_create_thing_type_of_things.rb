class CreateThingTypeOfThings < ActiveRecord::Migration
  def change

  	create_table :type_of_things do |t|
      t.string :name, {null:false}

      t.timestamps null: false
    end
  	
    create_table :thing_type_of_things do |t|
      t.references :thing, {index: true, foreign_key: true, null:false}
      t.references :type_of_thing, {index: true, foreign_key: true, null:false}

      t.timestamps null: false
    end
    add_index :thing_type_of_things, [:thing_id , :type_of_thing_id] , :unique => true
  end

end
