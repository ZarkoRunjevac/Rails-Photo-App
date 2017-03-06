class CreateThingTags < ActiveRecord::Migration
  def change

  	create_table :tags do |t|
      t.string :name, {null:false}
      t.integer :creator_id, {null:false}
      t.timestamps null: false
    end
  	
    create_table :thing_tags do |t|
      t.references :thing, {index: true, foreign_key: true, null:false}
      t.references :tag, {index: true, foreign_key: true, null:false}
      t.integer :creator_id, {null:false}
      t.timestamps null: false
    end
    add_index :tags, :creator_id
    add_index :thing_tags, [:thing_id , :tag_id] , :unique => true
  end

end
