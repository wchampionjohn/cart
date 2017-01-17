class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def formated_of(errors)
    errors.inject('') do |result, error|
      messages = error[:messages].inject('') do |result, message|
        result << "  #{message.first} #{message.last.join(' ')} \n"
      end
      result << "id:#{error[:id]} \n#{messages}"
    end
  end
end
