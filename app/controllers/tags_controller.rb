class TagsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  before_action :set_tag, only: [:show, :update, :destroy]
  wrap_parameters :tag, include: ["name"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized, except: [:tags_with_things]
  after_action :verify_policy_scoped, only: [:index]

  def index
    authorize Tag
    tags = policy_scope(Tag.all)
    #binding.pry
    @tags = TagPolicy.merge(tags)
    
  end

  def show

    authorize @tag
    tags = policy_scope(Tag.from('tags t').where('t.id= (?)',@tag.id))
    @tag = TagPolicy.merge(tags).first
  end

  def tags_with_things
    @tags=Tag.with_things
  end

  def create
    authorize Tag
    @tag = Tag.new(tag_params)
    @tag.creator_id=current_user.id

    User.transaction do
      if @tag.save
        role=current_user.add_role(Role::ORGANIZER, @tag)
        @tag.user_roles << role.role_name
        role.save!
        #binding.pry
        render :show, status: :created, location: @tag
      else
        render json: {errors:tag.errors.messages}, status: :unprocessable_entity
      end
    end
  end


  def update
    authorize @tag
    #tag = Tag.find(params[:id])

    if @tag.update(tag_params)
      head :no_content
    else
      render json: {errors:tag.errors.messages}, status: :unprocessable_entity
    end
  end


  def destroy
    authorize @tag
    @tag.destroy

    head :no_content
  end

  private
    def set_tag
      @tag = Tag.find(params[:id])
    end

    def tag_params
      params.require(:tag).permit(:name)
    end
end
