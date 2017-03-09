class RegistrationsController < DeviseTokenAuth::RegistrationsController

  def create
    super do |resource|
      #binding.pry
      create_image(resource) if resource && params[:image_content]
      resource
    end
  end


  private

  def create_image(user)

  end

  def image_content_params
    params.require(:image_content).tap { |ic|
      ic.require(:content_type)
      ic.require(:content)
    }.permit(:content_type, :content)
  end
end
