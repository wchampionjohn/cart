class ProductsController < ResourcesController
  helper_method :params

  def index
    respond_to do |f|
      f.html do
        @statuses = Product.statuses
        render :index
      end
      f.json { render json: collection_scope, each_serializer: ProductSerializer, status: :ok }
    end
  end

  def batch_update
    errors = []
    params[:products].each do |product|
      update_result = Product.update(product['id'],
                                     product.to_unsafe_h.slice(*['title', 'description', 'price', 'calculate', 'status']))

      if update_result.errors.present?
        errors << { id: product['id'],  messages: update_result.errors.messages }
      end
    end

    if errors.present?
      render text: formated_of(errors), status: :unprocessable_entity
    else
      render json: {}, status: :ok
    end
  end


  def batch_delete
    ids = params['ids'].map(&:to_i)
    Product.where(id: ids).delete_all
    render json: {}, status: :ok
  end

  def collection_scope
    if params['keyword'].present?
      Product.filter_with(params['keyword']).order(:id).page(params[:page])
    else
      Product.order(:id).page(params[:page])
    end
  end

  private
  def products_mapping
    params[:products].inject({}) do |result, product|
      result[product['id']] = product.to_unsafe_h.slice(*['title', 'description', 'price', 'calculate'])
      result
    end
  end
end
