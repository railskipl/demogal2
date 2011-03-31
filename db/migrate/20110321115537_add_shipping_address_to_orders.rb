class AddShippingAddressToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :shipping_address, :text
  end

  def self.down
    remove_column :orders, :shipping_address
  end
end
