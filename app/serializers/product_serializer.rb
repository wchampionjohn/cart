class ProductSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper

  attributes :id, :title, :description, :price, :status, :calculate, :created_at, :updated_at

  def created_at
    object.created_at.strftime("%Y-%m-%d %H:%M:%S")
  end
  def updated_at
    time_ago_in_words object.updated_at
  end

end
