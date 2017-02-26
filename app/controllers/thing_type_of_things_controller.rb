class ThingTypeOfThingsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  wrap_parameters :thing_type_of_thing, include: ["thing_type_of_thing_id", "thing_id"]
  before_action :authenticate_user!, only: [:create, :destroy]
  before_action :get_thing, only: [:destroy]
  before_action :get_thing_type_of_thing, only: [:destroy]
  before_action :authenticate_user!, only: [:create, :destroy]
  after_action :verify_authorized


  def destroy
    authorize @thing_type_of_thing
    @thing_type_of_thing.destroy
    head :no_content
  end

    def create
    thing_type_of_thing = ThingTypeOfThing.new(thing_type_of_thing_create_params.merge({
                                                                     :type_of_thing_id=>params[:type_of_thing_id],
                                                                     :thing_id=>params[:thing_id],
                                                                 }))
    thing=Thing.where(id:thing_type_of_thing.thing_id).first
    if !thing
      full_message_error "cannot find thing[#{params[:thing_id]}]", :bad_request
      skip_authorization
    elsif !TypeOfThing.where(id:thing_type_of_thing.type_of_thing_id).exists?
      full_message_error "cannot find image[#{params[:type_of_thing_id]}]", :bad_request
      skip_authorization
    else
      authorize ThingTypeOfThing
      
      if thing_type_of_thing.save
        head :no_content
      else
        render json: {errors:@thing_type_of_thing.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  private
  def get_thing
    @thing ||= Thing.find(params[:thing_id])
  end
  def get_type_of_thing
    @type_of_thing ||= TypeOfThing.find(params[:type_of_thing_id])
  end
  def get_thing_type_of_thing
    #@thing_image ||= ThingImage.find(params[:id])
    @thing_type_of_thing ||=ThingTypeOfThing.find(params[:id])
  end

  def thing_type_of_thing_create_params
    params.require(:thing_type_of_thing).tap {|p|
      #_ids only required in payload when not part of URI
      p.require(:type_of_thing_id)    if !params[:type_of_thing_id]
      p.require(:thing_id)    if !params[:thing_id]
    }.permit(:type_of_thing_id, :thing_id)
  end

end
