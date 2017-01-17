class Product < ApplicationRecord
  paginates_per 10

  validates :title, :price, :calculate, presence: true

  enum status: {'缺貨' => 1, '補貨中' => 2, '正常供應' => 3}

  scope :filter_with, -> (keyword) { where("title like ? OR description like ?", "%#{keyword}%", "%#{keyword}%") }
end
