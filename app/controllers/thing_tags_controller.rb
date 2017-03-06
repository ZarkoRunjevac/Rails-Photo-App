class ThingTagsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  wrap_parameters :thing_tag, include: ["thing_tag_id", "thing_id"]
  before_action :authenticate_user!, only: [:create, :destroy]
  before_action :get_thing, only: [:thingtags, :destroy]
  before_action :get_tag, only: [:index]
  before_action :get_thing_tag, only: [:destroy]
  before_action :authenticate_user!, only: [:create, :destroy]
  after_action :verify_authorized


  def index
    #binding.pry
    authorize ThingTag
    @tags = @tag.thing_tags.all.with_thing_name
    
  end

  def thingtags
    #binding.pry
    authorize ThingTag
    @tags=@thing.thing_tags.all.with_tag_name
    render :index
  end

  def linkable_tags

    thing = Thing.find(params[:thing_id])
    authorize thing
    #binding.pry
    @tags=Tag.not_linked(thing)
    @tags=TagPolicy::Scope.new(current_user,@tags).user_roles
    @tags=TagPolicy.merge(@tags)
    
    render "tags/index"
  end

  def create
    #binding.pry
    thing_tag =  ThingTag.new(:thing_id=>params[:thing_id],:tag_id=>params[:tag_id])
    thing=Thing.where(id:thing_tag.thing_id).first
    if !thing
      full_message_error "cannot find thing[#{params[:thing_id]}]", :bad_request
      skip_authorization
    elsif !Tag.where(id:thing_tag.tag_id).exists?
      full_message_error "cannot find image[#{params[:tag_id]}]", :bad_request
      skip_authorization
    else
      authorize thing, :add_tag?
      thing_tag.creator_id=current_user.id
      if thing_tag.save
        head :no_content
      else
        render json: {errors:@thing_tag.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def destroy
    #binding.pry
    authorize @thing, :remove_tag?
    @thing_tag.destroy
    head :no_content
  end

  private
  def get_thing
    @thing ||= Thing.find(params[:thing_id])
  end
  def get_tag
    @tag ||= Tag.find(params[:tag_id])
  end
  def get_thing_tag
    #@thing_image ||= ThingImage.find(params[:id])
    @thing_tag ||=ThingTag.find(params[:id])
  end

  def thing_tag_create_params

    params.require(:thing_tag).tap {|p|
      #_ids only required in payload when not part of URI
      p.require(:tag_id)    if !params[:tag_id]
      p.require(:thing_id)    if !params[:thing_id]
    }.permit(:tag_id, :thing_id)
    binding.pry
  end

end
