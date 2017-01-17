class ResourcesController < ApplicationController
  helper_method :current_collection, :current_object

  def index
  end

  def new
    @current_object = collection_scope.new
  end

  def create
    @current_object = collection_scope.create(object_params)
    respond_to do |f|
      f.html do
        if @current_object.valid?
          flash[:success] = '新增成功'
          redirect_to url_after_create
        else
          render :new
        end
      end
      f.json
    end
  end

  def destroy
    current_object.destroy
    respond_to do |f|
      f.html do
        flash[:success] = '刪除成功'
        redirect_to url_after_destroy
      end
      f.json
    end
  end

  def edit
  end

  def update
    if current_object.update(object_params)
      respond_to do |f|
        f.html do
          flash[:success] = '更新成功'
          redirect_to url_after_update
        end
        f.json
      end
    else
      respond_to do |f|
        f.html do |f|
          render action: :edit
        end
        f.json
      end
    end
  end

  private

  def url_after_create
    request.env['HTTP_REFERER'] || url_for(action: :index)
  end

  alias url_after_update url_after_create
  alias url_after_destroy url_after_create

  def collection_scope
    # You should implement it in your controller
  end

  def object_params
    # You should implement it in your controller
  end

  def current_collection
    @collection ||= collection_scope.page(params[:page])
  end

  def current_object
    @current_object ||= collection_scope.find(params[:id])
  end
end
