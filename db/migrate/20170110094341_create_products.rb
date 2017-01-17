class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :title
      t.text :description
      t.integer :price
      t.integer :calculate
      t.integer :status

      t.timestamps null: false
    end
  end
end
