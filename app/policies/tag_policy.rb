class TagPolicy < ApplicationPolicy

  def index?
    @user
  end

  def show?
    @user
  end	

  def create?
    @user
  end

  def update?
    organizer?
  end

  def destroy?
    organizer_or_admin?
  end


  class Scope < Scope
    def user_roles
      
      joins_clause=["left join Roles r on r.mname='Tag'",
                    "r.mid=t.id",
                    "r.user_id #{user_criteria}"].join(" and ")
      scope.from('tags t').select("t.*, r.role_name")
          .joins(joins_clause)
    end

    def resolve
      user_roles
    end

   
  end

=begin
  class Scope < Scope
    def user_roles members_only=true, allow_admin=true
      include_admin=allow_admin && @user && @user.is_admin?
      member_join = members_only && !include_admin ? "join" : "left join"
      joins_clause=["#{member_join} Roles r on r.mname='Tag'",
                    "r.mid=t.id",
                    "r.user_id #{user_criteria}"].join(" and ")
      scope.from('tags t').select("t.*, r.role_name")
          .joins(joins_clause)
          .tap {|s|
        if members_only
          s.where("r.role_name"=>[Role::ORGANIZER, Role::MEMBER])
        end}
    end
    def resolve
      user_roles
    end
  end
=end
end
