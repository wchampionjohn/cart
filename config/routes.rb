Rails.application.routes.draw do
  resources :products do
    collection do
      post   'batch_update'
      delete 'batch_delete'
    end
  end
end
