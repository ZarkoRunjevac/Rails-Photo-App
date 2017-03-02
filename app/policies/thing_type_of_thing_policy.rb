class ThingTypeOfThingPolicy < ApplicationPolicy

  def index?
    true
  end

  def thing_tags?
    true
  end
   def linkable_tags?
    #@user.has_role([Role::ORGANIZER], Thing)
    true
  end

  def create?
    @user && resource_organizer?
  end

  def destroy?
    @user && resource_organizer?
  end

  def linkable_type_of_things?
    @user && resource_organizer?
  end
  def resource_organizer?
    @user.has_role([Role::ORGANIZER], Thing)
  end
  class Scope < Scope
    def resolve
      scope
    end
  end
end
