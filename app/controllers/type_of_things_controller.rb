class TypeOfThingsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  before_action :set_type_of_thing, only: [:show, :update, :destroy]
  wrap_parameters :type_of_thing, include: ["name"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  def index
    authorize TypeOfThing
    type_of_things = policy_scope(TypeOfThing.all)
    #binding.pry
    @type_of_things = TypeOfThingPolicy.merge(type_of_things)
    
  end

  def show

    authorize @type_of_thing
    type_of_things = policy_scope(TypeOfThing.from('type_of_things t').where('t.id= (?)',@type_of_thing.id))
    @type_of_thing = TypeOfThingPolicy.merge(type_of_things).first
  end

  def create
    authorize TypeOfThing
    @type_of_thing = TypeOfThing.new(type_of_thing_params)
    @type_of_thing.creator_id=current_user.id

    User.transaction do
      if @type_of_thing.save
        role=current_user.add_role(Role::ORGANIZER, @type_of_thing)
        @type_of_thing.user_roles << role.role_name
        role.save!
        #binding.pry
        render :show, status: :created, location: @type_of_thing
      else
        render json: {errors:type_of_thing.errors.messages}, status: :unprocessable_entity
      end
    end
  end


  def update
    authorize @type_of_thing
    #type_of_thing = TypeOfThing.find(params[:id])

    if @type_of_thing.update(type_of_thing_params)
      head :no_content
    else
      render json: {errors:type_of_thing.errors.messages}, status: :unprocessable_entity
    end
  end


  def destroy
    authorize @type_of_thing
    @type_of_thing.destroy

    head :no_content
  end

  private
    def set_type_of_thing
      @type_of_thing = TypeOfThing.find(params[:id])
    end

    def type_of_thing_params
      params.require(:type_of_thing).permit(:name)
    end
end
