class ThingTypeOfThingPolicy < ApplicationPolicy
  
  def create?
    @user && resource_organizer?
  end

  def destroy?
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
