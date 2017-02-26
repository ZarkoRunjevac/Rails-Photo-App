class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.references :user, index: true, foreign_key: true
      t.string :role_name
      t.string :mname
      t.integer :mid

      t.timestamps null: false
    end
  end
end
