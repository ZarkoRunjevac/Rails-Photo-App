class RegistrationsController < DeviseTokenAuth::RegistrationsController

  def create
    super do |resource|
      #binding.pry
      create_image(resource) if resource && params[:image_content]
      #resource
    end
  end


  private

  def create_image(user)
    begin
      User.transaction do
        @image=Image.new

        @image.creator_id=user.id
        @image.user=user

        if @image.save

          original=ImageContent.new(image_content_params)
          contents=ImageContentCreator.new(@image, original).build_contents

          if contents.save!
            return true
          end

          render_create_error_invalid_image
        end

      end

    end

  rescue => e
    render_create_error__image_exception e
  end

  def image_content_params
    params.require(:image_content).tap { |ic|
      ic.require(:content_type)
      ic.require(:content)
    }.permit(:content_type, :content)
  end

  protected

  def render_create_error_invalid_image
    render json: {
        status: 'error',
        errors: ['invalid image']
    }, status: 422
  end

  def render_create_error__image_exception(e)

    render json: {
        status: 'error',
        errors: [e.message]
    }, status: 422

  end

end
